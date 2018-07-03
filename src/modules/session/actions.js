import {
  LOAD_FLIGHT_DIRECTORY_CONFIG_REQUESTED,
} from './actionTypes';

export function fetchFlightDirectoryConfig() {
  const url = "http://center.alces-flight.lvh.me:3003/flight_directory_config";
  return {
    type: LOAD_FLIGHT_DIRECTORY_CONFIG_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          url: url,
          withCredentials: true,
        },
      },
    },
  };
}
