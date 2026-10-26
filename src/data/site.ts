// Facts used across the site. Change the WhatsApp number here once and every link updates.
export const site = {
  name: 'Oakwell Hotel Blackpool',
  url: 'https://oakwellhotel.com',
  address: '357 South Promenade, Blackpool',
  email: 'oakwellhotel@gmail.com',
  // Placeholder carried over from the old site: replace with the real number (country code, no +).
  whatsappNumber: '440000000000',
  mapsUrl:
    'https://www.google.com/maps/place/Oakwell+-+Family+Hotel/@53.8015846,-3.0548673,17z/data=!3m1!4b1!4m9!3m8!1s0x487b44120467c099:0xa2dd719ded48ccd3!5m2!4m1!1i2!8m2!3d53.8015846!4d-3.0548673!16s%2Fg%2F1tp_5ycb',
};

export const whatsappUrl = (text = "Hi Oakwell, we'd like to book a stay.") =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
