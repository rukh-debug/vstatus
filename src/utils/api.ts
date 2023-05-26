import axios from 'axios';

export async function sendRequest(serverurl: string, body: object, apikey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const requestConfig = {
      method: "post",
      url: serverurl,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'authKey': apikey
      },
      data: body
    };

    axios.request(requestConfig)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
