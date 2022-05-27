
export const API_BASE_URL = 'http://localhost:5000';


const BUCKETNAME = process.env.NODE_ENV === 'production' ? 'amurse_spaces' : 'amurse_spaces_dev';

// MEDIA FILES
export const ENDPOINT_MEDIA_DOWNLOAD = `https://storage.googleapis.com/${BUCKETNAME}/`;
// export const ENDPOINT_MEDIA_DOWNLOAD = 'https://storage.googleapis.com/realtorpanel_public/' //for production

