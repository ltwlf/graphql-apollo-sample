import { RESTDataSource } from "apollo-datasource-rest"
import * as isEmail from 'isemail'

export type User = {
  id: string
  email: string
}

export class UserAdapter extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "http://localhost:7072/api/"
  }

  async findOrCreateUser({ email: emailArg } = { email: null }): Promise<User> {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const response = await this.get<User[]>('users')

    let user = response.find(u => u.email === email)

    if (!user) {
      user = await this.put<User>('users', { email })
    }

    return user
  }

  async bookTrips({ launchIds }) {
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    /*
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }
 
    return results;
    */
  }

  async bookTrip({ launchId }) {
    /*
  const userId = this.context.user.id;
  const res = await this.store.trips.findOrCreate({
    where: { userId, launchId },
  });
  return res && res.length ? res[0].get() : false;
  */
  }

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    // return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser() {
    /*
  const userId = this.context.user.id;
  const found = await this.store.trips.findAll({
    where: { userId },
  });
  return found && found.length
    ? found.map(l => l.dataValues.launchId).filter(l => !!l)
    : [];
    */
  }

  async isBookedOnLaunch({ launchId }) {
    /*
  if (!this.context || !this.context.user) return false;
  const userId = this.context.user.id;
  const found = await this.store.trips.findAll({
    where: { userId, launchId },
  });
  return found && found.length > 0;
  */
  }
}