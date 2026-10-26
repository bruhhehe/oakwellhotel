// Guest book entries, carried over from the old site. Shown two to a spread, one to a page on phones.
export interface Review {
  quote: string;
  name: string;
  stay: string;
}

export const reviews: Review[] = [
  { quote: 'A lovely family hotel right on the seafront. The children felt welcome straight away and we could walk everywhere.', name: 'The Ahmed family', stay: 'Family weekend stay' },
  { quote: 'Warm, clean and peaceful. It felt homely from the minute we arrived, and the location made our Blackpool trip so easy.', name: 'Sarah M.', stay: 'Summer break' },
  { quote: 'The kids loved being close to the beach and arcades. We loved how calm and family friendly the hotel felt.', name: 'Nadia and family', stay: 'School holiday stay' },
  { quote: 'Everything was simple, comfortable and welcoming. We booked by message and the whole stay was stress free.', name: 'James R.', stay: 'Two night stay' },
  { quote: 'A brilliant base for Pleasure Beach and Sandcastle Waterpark. We came back each evening to a quiet, cosy room.', name: 'The Patel family', stay: 'Blackpool attractions trip' },
  { quote: 'Friendly hosts, great seafront position and a relaxed atmosphere. We would happily come back again.', name: 'Amina K.', stay: 'Seaside getaway' },
  { quote: 'The room was spotless and comfortable, and the sea view in the morning was such a treat. Perfect for our little family break.', name: 'Rebecca T.', stay: 'Seafront room stay' },
  { quote: 'We wanted somewhere relaxed and alcohol free for the kids. Oakwell was exactly what we needed: friendly, quiet and close to everything.', name: 'The Khan family', stay: 'Weekend in Blackpool' },
  { quote: 'The hosts were so helpful with directions and local tips. It made our first family visit to Blackpool feel really easy.', name: 'Claire and Mark', stay: 'First Blackpool visit' },
  { quote: 'Lovely atmosphere, comfy beds and a brilliant location on the promenade. The children are already asking when we can go back.', name: 'The Hussain family', stay: 'Promenade stay' },
  { quote: 'A proper family hotel with a calm feel. We could enjoy Blackpool during the day and come back to somewhere peaceful at night.', name: 'Emma L.', stay: 'Family seaside break' },
  { quote: 'Booking was quick, check-in was simple and the hotel had everything we needed. A very welcoming place to stay.', name: 'Daniel P.', stay: 'Short family stay' },
];
