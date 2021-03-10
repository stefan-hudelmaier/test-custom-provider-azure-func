module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log("Context: ", JSON.stringify(context));
    context.log("Request: ", JSON.stringify(req));

    context.res = {
        body: JSON.stringify(
            {
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
            })
    };
}
