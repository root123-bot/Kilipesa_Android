import { domain } from "../constants/domain";
import { Platform } from "react-native";
{
  /* 
    The problem here is that iOS does not allow HTTP requests by default, only HTTPS. 
    If you want to enable HTTP requests add this to your info.plist:
    That's why i failed to send request to HTTP..
    https://stackoverflow.com/questions/38418998/react-native-fetch-network-request-failed
*/
}

export const resetPassword = (email) => {
  return fetch(`${domain}/api/password_reset/`, {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const updateRecords = (fdata, headers) => {
  return fetch(`${domain}/api/updaterecord/`, {
    method: "POST",
    body: fdata,
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  }).then((response) => response.json());
};

export const createRecords = (fdata, headers) => {
  return fetch(`${domain}/api/add_record_api/`, {
    method: "POST",
    body: fdata,
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  }).then((response) => response.json());
};

export const isUserActive = (email) => {
  return fetch(`${domain}/api/is_user_active/`, {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const changeGathermanPassword = (
  id,
  old_password,
  new_password,
  confirm_password
) => {
  return fetch(`${domain}/api/change_password/`, {
    method: "POST",
    body: JSON.stringify({
      id,
      old_password,
      new_password,
      confirm_password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const userstatus = (id) => {
  return fetch(`${domain}/api/user_status/`, {
    method: "POST",
    body: JSON.stringify({
      id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const editGathermanProfile = (fdata, headers) => {
  return fetch(`${domain}/api/edit_gatherman_profile/`, {
    method: "POST",
    body: fdata,
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  }).then((response) => response.json());
};

{
  /*  unable to send the form data in android while it goes in ios...
  On Android in Expo 45 / React Native 0.68 with Hermes (and Flipper), 
  POSTing a FormData object fails instantly with a Network Error. Works on iOS. Axios 24 works and seems to be the last reliable version.

  https://github.com/axios/axios/issues/4800
*/
}

export const completeGathermanProfile = (fdata, headers) => {
  return fetch(`${domain}/api/create_gatherman_profile/`, {
    method: "POST",
    body: fdata,
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  }).then((response) => response.json());
};

export const registergatherman = (email, password, user_group) => {
  return fetch(`${domain}/api/register/`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      user_group,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const fetchRegions = () => {
  return fetch(`${domain}/api/regions/`).then((response) => response.json());
};

export const fetchDistricts = () => {
  return fetch(`${domain}/api/districts/`).then((response) => response.json());
};

export const fetchToken = (email, password) => {
  return fetch(`${domain}/api/token/`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const fetchGathermanProfile = (id) => {
  console.log("gatherman id user_id ", id);
  return fetch(`${domain}/api/gathermanbio/`, {
    method: "POST",
    body: JSON.stringify({
      id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const fetchInfosByGatherman = (id) => {
  return fetch(`${domain}/api/gathered_byme/`, {
    method: "POST",
    body: JSON.stringify({
      id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const loginGatherman = (email, password) => {
  return fetch(`${domain}/api/token/`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};
