const appDataSource = require('../../models/dataSource');

const createEvents = (eventList) => {
  const eventData = [];

  for (const event of eventList) {
    eventData.push([
      event.id,
      event.name,
      event.host_wallet_address,
      event.host_nft_id,
      event.smart_contract_address,
      event.nft_project_name,
      event.place,
      event.capacity,
      event.images,
      event.description,
      event.timeline,
      event.custom_info,
      event.start_date_time,
      event.end_date_time,
    ]);
  }

  return appDataSource.query(
    `
      INSERT INTO Event
        (
          id,
          name,
          host_wallet_address,
          host_nft_id,
          smart_contract_address,
          nft_project_name,
          place,
          capacity,
          images,
          description,
          timeline,
          custom_info,
          start_date_time,
          end_date_time
        )
      VALUES ? 
    `,
    [eventData]
  );
};

module.exports = { createEvents };
