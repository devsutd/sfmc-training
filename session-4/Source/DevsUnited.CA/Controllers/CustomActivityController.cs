using System;
using System.Configuration;
using System.IO;
using System.Reflection;
using System.Web.Mvc;
using System.Net;
using Newtonsoft.Json;
using log4net;
using System.Text;
using RestSharp;

namespace DevsUnited.CA.Controllers
{
    public class CustomActivityController : Controller
    {
        private ILog _logger;

        public CustomActivityController()
        {
            _logger = LogManager.GetLogger(typeof(CustomActivityController));
        }

        [HttpPost]
        public JsonResult Index()
        {
            return Json(new { status = "ok" });
        }

        [HttpPost]
        public JsonResult Save()
        {
            return Json(new { status = "ok" });
        }

        [HttpPost]
        public JsonResult Publish()
        {
            return Json(new { status = "ok" });
        }

        [HttpPost]
        public JsonResult Stop()
        {

            return Json(new { status = "ok" });
        }

        [HttpPost]
        public JsonResult Validate()
        {
            return Json(new { status = "ok" });
        }

        [HttpPost]
        public JsonResult Execute()
        {
            try
            {
                _logger.Info("Executing Execute method...");

                string body;

                using (Stream receiveStream = Request.InputStream)
                {
                    using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8))
                    {
                        body = readStream.ReadToEnd();
                    }
                }

                var client = new RestClient();
                var request = new RestSharp.RestRequest("https://devsutd-requestbin.herokuapp.com/zrx1tezr", RestSharp.Method.POST) { RequestFormat = RestSharp.DataFormat.Json }
                 .AddJsonBody(body);
                var response = client.Execute(request);

                if (response.Content.StartsWith("ok"))
                    return Json(new { branchResult = "sent" });

                return Json(new { branchResult = "notsent" });
            }
            catch (Exception ex)
            {
                _logger.Error($"Error executing Execute method. {ex}");
                return Json(new { branchResult = "notsent" });
            }
        }
        
    }
}