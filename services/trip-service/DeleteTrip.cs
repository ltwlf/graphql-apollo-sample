using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Linq;


namespace SpaceX
{
    public static class DeleteTrip
    {
        [FunctionName("DeleteTrip")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "trips/{id}")] HttpRequest req,
            string id,
            [CosmosDB(
                databaseName: "SpaceX",
                collectionName: "Trips",
                ConnectionStringSetting = "CosmosDBConnection",
                PartitionKey = "{id}",
                Id = "{id}")]
                Document document,
            [CosmosDB(
                databaseName: "SpaceX",
                collectionName: "Trips",
                ConnectionStringSetting = "CosmosDBConnection")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("Delete trip");

            await client.DeleteDocumentAsync(document.SelfLink, new RequestOptions() { PartitionKey = new PartitionKey(id) });

            return new OkResult();
        }
    }
}
