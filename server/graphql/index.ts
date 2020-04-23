import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ApolloServer } from 'apollo-server-azure-functions'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { LaunchAdapter, UserAdapter, TripAdapter } from "./adapter"


const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAdapter: new LaunchAdapter(),
        userAdapter: new UserAdapter(),
        tripAdpater: new TripAdapter(),
    }),
    playground: {
        settings: {
            'editor.theme': 'dark',
        },
    },
    introspection: true,
    // context: createContext,
})

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: true,
        credentials: true,
    },
})
