import { paginateResults } from './utils'


export const resolvers = {
    Query: {
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAdapter.getAllLaunches()
            // we want these in reverse chronological order
            allLaunches.reverse()
            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches,
            })
            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                // if the cursor of the end of the paginated results is the same as the
                // last item in _all_ results, then there are no more results after this
                hasMore: launches.length
                    ? launches[launches.length - 1].cursor !==
                    allLaunches[allLaunches.length - 1].cursor
                    : false,
            }
        },
        launch: (_, { id }, { dataSources }) =>
            dataSources.launchAdapter.getLaunchById({ launchId: id }),
        me: async (_, __, { dataSources }) =>
            dataSources.userAdapter.findOrCreateUser(),
    },
    Mutation: {
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAdapter.findOrCreateUser({ email })
            if (user) return Buffer.from(email).toString("base64")
        },
        bookTrips: async (_, { launchIds }, { dataSources }) => {
            const results = await dataSources.tripAdapter.bookTrips({ launchIds })
            const launches = await dataSources.launchAdapter.getLaunchesByIds({
                launchIds,
            })

            return {
                success: results && results.length === launchIds.length,
                message:
                    results.length === launchIds.length
                        ? "trips booked successfully"
                        : `the following launches couldn't be booked: ${launchIds.filter(
                            (id) => !results.includes(id)
                        )}`,
                launches,
            }
        },
        cancelTrip: async (_, { launchId }, { dataSources }) => {

            const success = await dataSources.tripAdapter.cancelTrip({launchId})
            const launches = dataSources.launchAdapter.getAllLaunches()

            return {
                success,
                launches
            }

            throw new Error('not implemented')
        },
    },
    Mission: {
        missionPatch: (mission, { size } = { size: "LARGE" }) => {
            return size === "SMALL"
                ? mission.missionPatchSmall
                : mission.missionPatchLarge
        },
    },
    Launch: {
        isBooked: async (launch, _, { dataSources, user }) => {
            const trips = await dataSources.tripAdapter.allTrips()
            return trips.find(t => t.launchId === launch.id.toString() && t.userId === user.id) !== undefined
        },
    },
    User: {
        trips: async (user, __, { dataSources }) => {

            const trips = await dataSources.tripAdapter.allTrips().filter(t => user.id)

            if (!trips.length) return []

            return (
                dataSources.launchAdapter.getLaunchesByIds({
                    ...trips.map(t => t.id),
                }) || []
            )
        },
    },
}