import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ApolloServer } from 'apollo-server-azure-functions'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { LaunchAdapter, UserAdapter, TripAdapter } from "./adapter"
import { context } from './context'


const server = new ApolloServer({
    context,
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAdapter: new LaunchAdapter(),
        userAdapter: new UserAdapter(),
        tripAdapter: new TripAdapter(),
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
