define([
    'postmonger',
    'tokenize2',
    'select2'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('clickedNext', save);

    function onRender() {
        connection.trigger('ready');
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        console.log("Data", data);

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        if (inArguments.length > 0) {
            var values = inArguments[inArguments.length - 1];
            for (var property in values) {
                $("textarea#" + property).val(values[property]);
            }
        }
    }

    function save() {
        var formData = {};

        formData.message = $("textarea#message").val();
        payload['arguments'].execute.inArguments.push(formData);

        payload['metaData'].isConfigured = true;

        connection.trigger('updateActivity', payload);
    }
});