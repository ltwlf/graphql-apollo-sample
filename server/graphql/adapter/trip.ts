import { RESTDataSource } from "apollo-datasource-rest"
import * as isEmail from 'isemail'

export type DBTrip = {
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
    return await this.get<DBTrip[]>('trips')
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
    // return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  /*
  async getLaunchIdsByUser() {

  const userId = this.context.user.id;
  const found = await this.store.trips.findAll({
    where: { userId },
  });
  return found && found.length
    ? found.map(l => l.dataValues.launchId).filter(l => !!l)
    : [];
    
  }
  */

      /*
  async isBookedOnLaunch({ launchId }) {

  if (!this.context || !this.context.user) return false;
  const userId = this.context.user.id;
  const found = await this.store.trips.findAll({
    where: { userId, launchId },
  });
  return found && found.length > 0;

  }
    */
}