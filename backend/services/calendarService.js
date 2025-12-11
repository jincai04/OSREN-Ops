const { google } = require('googleapis');

class CalendarService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  }

  async createEvent(eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'Asia/Kuala_Lumpur',
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'Asia/Kuala_Lumpur',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        resource: event,
      });

      return {
        id: response.data.id,
        link: response.data.htmlLink,
        success: true,
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async getEvents(timeMin, timeMax) {
    try {
      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        description: event.description,
        startTime: event.start.dateTime || event.start.date,
        endTime: event.end.dateTime || event.end.date,
        link: event.htmlLink,
      }));

      return events;
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'Asia/Kuala_Lumpur',
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'Asia/Kuala_Lumpur',
        },
      };

      const response = await this.calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        resource: event,
      });

      return {
        id: response.data.id,
        link: response.data.htmlLink,
        success: true,
      };
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
}

module.exports = new CalendarService();
