#!/bin/bash

http GET :7071/api/HttpTrigger1 x-ms-customproviders-requestpath:/subscriptions/123/resourceGroups/myrg/providers/Microsoft.CustomProviders/resourceProviders/public
