module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log("Context: ", JSON.stringify(context, null, 2));
    context.log("Request: ", JSON.stringify(req, null, 2));

    context.res = {
        body: {
                value: [{
                    name: "Test",
                    properties: {
                        age: 39
                    }
                }, {
                    name: "Test2",
                    properties: {
                        age: 41
                    }
                }]
            }
    };

    context.done();
}
