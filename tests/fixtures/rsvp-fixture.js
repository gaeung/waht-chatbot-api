const appDataSource = require('../../models/dataSource');

const createRsvps = (rsvpList) => {
  const rsvpData = [];

  for (const rsvp of rsvpList) {
    rsvpData.push([rsvp.wallet_address, rsvp.event_id]);
  }

  return appDataSource.query(
    `
      INSERT INTO RSVP 
        (
          wallet_address,
          event_id
        )
      VALUES ? 
    `,
    [rsvpData]
  );
};

module.exports = { createRsvps };
