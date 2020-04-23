using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SpaceX
{
    public static class GetTripById
    {
        [FunctionName("GetTripById")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "trips/{id}")] HttpRequest req,
            String id,
            [CosmosDB(
                databaseName: "SpaceX",
                collectionName: "Trips",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{id}",
                Id = "{id}")]
                JObject trip,
            ILogger log)
        {
            log.LogInformation($"Get trip {id}");

            return new OkObjectResult(trip);
        }
    }
}
