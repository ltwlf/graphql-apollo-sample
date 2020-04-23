import { RESTDataSource } from "apollo-datasource-rest"
import * as isEmail from 'isemail'

export type Trip = {
  id: string
  launchId: string
  userId: string
}

export class TripAdapter extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "http://localhost:7073/api/"
  }

  async allTrips() {
    return await this.get<Trip[]>('trips')
  }

  async bookTrips({ launchIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {

    const userId = this.context.user.id

    const trip = await this.put('trips', { userId, launchId })

    return trip
  }

  async cancelTrip({ launchId }) {

    const userId = this.context.user.id;

    const trip = (await this.allTrips()).filter(t => t.launchId === launchId && t.userId === userId)[0]
    
    await this.delete(`trips/${trip.id}`)

    return true
  }

}