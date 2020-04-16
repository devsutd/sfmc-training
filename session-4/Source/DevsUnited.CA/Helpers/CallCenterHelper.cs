using CallCenter.Models;
using Activities.Common.Helpers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Activities.Common.SFMCService;
using Activities.Common.Services;
using Newtonsoft.Json;
using log4net;

namespace CallCenter.Helpers
{
    public static class CallCenterHelper
    {
        static log4net.ILog _logger = LogManager.GetLogger("CallCenter Helper");

        private static SFMCHelper sfmc;

        public static void PostToRequestBin(string jwt)
        {
            using (WebClient wc = new WebClient())
            {
                wc.Headers[HttpRequestHeader.ContentType] = "application/jwt";
                string HtmlResult = wc.UploadString(ConfigurationManager.AppSettings["Test.Url"], jwt);
            }
        }

        public static DateTime GetDate()
        {
            Double timeoffset = 0;
            Double.TryParse(ConfigurationManager.AppSettings["UTC.Time.Offset"], out timeoffset);
            DateTime currentDate = DateTime.UtcNow;

            if (timeoffset != 0)
                currentDate = currentDate.AddHours(timeoffset);

            return currentDate;
        }

        public static CallCenterRequest ProcessJourneyEntry(dynamic inArguments, dynamic jsonObject)
        {
            string[] fieldsToIgnore = { "campaignName", "campaignid", "audiourl", "status", "vdnigito", "dename", "mid" };
            Dictionary<string, string> sfmcAttributes = new Dictionary<string, string>();
            Dictionary<string, object> replacedArguments = new Dictionary<string, object>();
            Dictionary<string, string> DEproperties = DEService.GetUserDataFromDE(int.Parse(inArguments.mid), int.Parse(ConfigurationManager.AppSettings["SFMC.MID"]), inArguments.dename, jsonObject.keyValue);

            //First we get all the SalesForceAttributes
            foreach (KeyValuePair<string, object> kvp in inArguments)
            {
                if (kvp.Key.Contains("SalesForceAttribute"))
                    sfmcAttributes.Add(kvp.Key, kvp.Value.ToString());
            }

            //Then we replace each key for the correct SalesForceAttribute or Data Extension value
            foreach (KeyValuePair<string, object> kvp in inArguments)
            {
                if (!kvp.Key.Contains("SalesForceAttribute"))
                {
                    bool replaced = false;
                    if (!fieldsToIgnore.Contains(kvp.Key) && kvp.Value.ToString().Contains("SalesForceAttribute."))
                    {
                        replacedArguments.Add(kvp.Key.ToString(), sfmcAttributes.ContainsKey(kvp.Value.ToString()) ? sfmcAttributes[kvp.Value.ToString()] : string.Empty);
                        replaced = true;
                    }

                    if (!fieldsToIgnore.Contains(kvp.Key) && !replaced)
                    {
                        replacedArguments.Add(kvp.Key.ToString(), DEproperties.ContainsKey(kvp.Value.ToString()) ? DEproperties[kvp.Value.ToString()] : string.Empty);
                    }
                }
            }

            //Finally, we return an object 
            return new CallCenterRequest()
            {
                SubscriberKey = jsonObject.keyValue,
                JourneyId = jsonObject.journeyId,
                MID = int.Parse(inArguments.mid),
                DEName = inArguments.dename,
                BRM = GetDictionaryValue(replacedArguments,"brm"),
                Name = GetDictionaryValue(replacedArguments,"name"),
                Phone = GetDictionaryValue(replacedArguments,"phone"),
                MobilePhone = GetDictionaryValue(replacedArguments,"mphone"),
                Email = GetDictionaryValue(replacedArguments,"email"),
                CampaignName = inArguments.campaignName,
                CampaignId = inArguments.campaignid,
                AudioURL = inArguments.audiourl,
                ServiceOrder = GetDictionaryValue(replacedArguments,"serviceorder"),
                WorkOrder = GetDictionaryValue(replacedArguments,"workorder"),
                ScheduledAppointment = GetDictionaryValue(replacedArguments,"appointment"),
                ScheduledDate = GetDictionaryValue(replacedArguments,"date"),
                ScheduledDateTime = GetDictionaryValue(replacedArguments,"datetime"),
                CallStatus = inArguments.status,
                IDSFID = GetDictionaryValue(replacedArguments,"idsfid"),
                DigitCode = string.Empty,
                CallType = string.Empty,
                VDNigito = inArguments.vdnigito,
                SFAttributes = sfmcAttributes
            };
        }

        public static void InsertIntoDE(CallCenterRequest request)
        {
            sfmc = new SFMCHelper(int.Parse( ConfigurationManager.AppSettings["SFMC.MID"].ToString()));
            Dictionary<string, string> values = new Dictionary<string, string>();

            values.Add("ID", Guid.NewGuid().ToString());
            values.Add("Data", JsonConvert.SerializeObject(request));
            values.Add("Activa", true.ToString());

            Task.Run(() => sfmc.CreateDataExtensionRow(ConfigurationManager.AppSettings["CallCenterDataEntry"], values));
        }

        public static RBResult SendActiveRecords()
        {
            int mid = int.Parse(ConfigurationManager.AppSettings["SFMC.MID"]);

            SFMCHelper sfmc = new SFMCHelper(mid);

            var deRows = sfmc.GetDataExtensionRows(mid, ConfigurationManager.AppSettings["CallCenterDataEntry"], new string[] { "ID", "Data", "Activa" }, new SimpleFilterPart { Property = "Activa", SimpleOperator = SimpleOperators.equals, Value = new string[] { "True" } });

            if (deRows.Count == 0)
                return new RBResult();

            _logger.DebugFormat("[{0}] active records recovered from Data Extension.", deRows.Count);

            bpelregisterblasters_client_ep client = new bpelregisterblasters_client_ep(ConfigurationManager.AppSettings["RB.URL"]);

            List<processArrClientes> arrClients = new List<processArrClientes>();

            foreach (var row in deRows)
            {
                var data = row.Properties.Where(p => p.Name == "Data").FirstOrDefault().Value;
                var id = row.Properties.Where(p => p.Name == "ID").FirstOrDefault().Value;
                try
                {
                    arrClients.Add(DEtoClient(row));
                }
                catch (Exception ex)
                {
                    _logger.ErrorFormat("Error trying to deserialize object. ID:{0} Data:{1} Exception:{2}", id, data, ex);
                    throw ex;
                }
            }
            _logger.DebugFormat("Updating status for [{0}] records on Data Extension", deRows.Count);
            //Upsert records into DE
            sfmc.UpdateBatch(deRows, mid, ConfigurationManager.AppSettings["CallCenterDataEntry"]);

            _logger.DebugFormat("[{0}] Records to be send to Register Blasters", arrClients.Count);
            processResponse response;
            try
            {
                response = client.process(new process
                {
                    Login = new processLogin { User = ConfigurationManager.AppSettings["RB.User"], Password = ConfigurationManager.AppSettings["RB.Password"], Ip = ConfigurationManager.AppSettings["RB.IP"] },
                    arrClientes = arrClients.ToArray()
                });
                _logger.DebugFormat("Send to Register Blasters complete with response: {0} ({1})", response.Result.Result, response.Result.ResultDescription );
            }
            catch (Exception ex)
            {
                _logger.ErrorFormat("Error sending request to Register Blaster. {0}", ex);
                return new RBResult { ResponseResult = "UnknownError", Data = deRows };
            }

            return new RBResult { ResponseResult = response.Result.Result, Data = deRows };

        }

        private static processArrClientes DEtoClient(DataExtensionObject deObj)
        {
            var data = Newtonsoft.Json.JsonConvert.DeserializeObject<CallCenterRequest>(deObj.Properties.Where(p => p.Name == "Data").FirstOrDefault().Value);

            return new processArrClientes
            {
                CuentaBRM = data.BRM,
                Nombre = data.Name,
                TelefonoFijo = data.Phone,
                TelefonoMovil = data.MobilePhone,
                CorreoElectronico = data.Email,
                NombreCampania = data.CampaignName,
                IdCampania = data.CampaignId,
                UrlAudio = data.AudioURL,
                FolioOrdenServicio = data.ServiceOrder,
                FolioOrdenTrabajo = data.WorkOrder,
                TurnoAgendamiento = data.ScheduledAppointment,
                FechaAgendamiento = data.ScheduledDate,
                HoraAgendamiento = data.ScheduledDateTime,
                EstatusLlamadas = data.CallStatus,
                IDSFID = data.IDSFID,
                CodigoDigito = data.DigitCode,
                TipoLamada = data.CallType,
                VDN = data.VDNigito
            };
        }
        public static void CreateReport(RBResult rbResult)
        {
            try
            {
                foreach (DataExtensionObject data in rbResult.Data)
                {
                    var requestData = JsonConvert.DeserializeObject<CallCenterRequest>(data.Properties.Where(p => p.Name == "Data").FirstOrDefault().Value);
                    string journeyId = requestData.JourneyId;
                    string subscriberKey = requestData.SubscriberKey;

                    ReportHelper.AddReport(int.Parse(ConfigurationManager.AppSettings["SFMC.MID"]), ConfigurationManager.AppSettings["ReportDE"], subscriberKey, journeyId, rbResult.ResponseResult);
                }
            }
            catch (Exception ex)
            {
                _logger.ErrorFormat("Error adding records to Report DE. {0}", ex.ToString());
            }
        }

        private static string GetDictionaryValue(Dictionary<string,object> dictionary, string key)
        {
            return dictionary.ContainsKey(key) ? dictionary[key].ToString() : string.Empty;
        }
    }
}