# vstatus

vstatus is a Visual Studio Code extension that extracts workspace information, such as filename, workspace name, and time elapsed, and sends this data to a server. The server then generates an SVG image based on the received information and serves it on an endpoint. This endpoint can be used to retrieve the updated SVG image containing filename, workspace name, and time lapse. (Intented to be used for github readme)

# Status

[![Live feed](https://vstatus.rubenk.com.np/api/status?theme=dark&timefor=file)](https://github.com/slithery0)

More examples below.

## Extension's Requirements

- Visual Studio Code version 1.78.0 or higher.

## Installation

To setup vstatus for yourself, follow these steps:

1. Deploy the server by clicking on the "Deploy with Vercel" button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fslithery0%2Fvstatus%2Ftree%2Fmain%2Fserver-next&env=VSTATUS_API_KEY,DB_TYPE&envDescription=Generate%20a%20random%20string%20and%20put%20it%20on%20VSTATUS_API_KEY.%20Keep%20it%20safe%2C%20this%20is%20like%20your%20password.%20AND%20in%20DB_TYPE%20use%20either%20%60postgres%60%20or%20%60kv%60.%20&project-name=vstatus&repository-name=vstatus)

2. You will be asked to add value for `VSTATUS_API_KEY` & `DB_TYPE`. For API key generate a secure key add inside the value field and keep it safe, you will need that in step 6. For Database either insert `postgres` or `kv` as it's value. Remember which one you set, you will need that in next step. Now you may proceed and press deploy button. YAY you are done with the deployment. Keep your server url, you will need that in step 6.

3. Once you've deployed your server, you'll need to go back to your **Vercel dashboard** and open the project dashboard you just created. From here, navigate to **Storage > Create New Database > KV or postgres (whatever you set as your `DB_TYPE` value) >> Continue**. After successfully creating the database, There will be a **connect** button, where you can click and connect it to the project you just created. ezpz!!!.

4. Install the vstatus extension in Visual Studio Code.

To install

Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

> ext install rubennnk.vstatus

Or you can do it manually. Search `vstatus` and install.

5. Open the extension's settings by navigating to **File > Preferences > Settings** or using the keyboard shortcut **Ctrl+Comma (,)**.

6. Configure the following settings:

- `vstatus.interval`: Specifies the interval (in seconds) at which vstatus extracts workspace information. `Default: 10`. Sending a request to server each 10 secon makes 1 vercel KV query. On hobby tier of vercel, you can send 30,000 KV query per month. So use calculate and set it accordingly.

- `vstatus.serverurl`: This is the URL of the deployed server. Provide the URL where the server is hosted and accessible. `eg. https://vstatus.verel.app`

- `vstatus.vstatus_api_key`: This is the API key set during the deployment of the server. The server stores the key in the .env file with the variable name `VSTATUS_API_KEY`.

8. Save the settings.

## Usage

To retrieve the SVG image containing the workspace information, use the following URL/endpoint:

`https://<your-server-url>/api/status`

Replace <your-server-url> with the URL where your server is hosted.

## Query Parameters

The following query parameters can be used to customize the appearance of the SVG image:

| Parameter  | Description                                                                                                            | Default Value |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------------- |
| theme      | Specifies the theme of the image. Valid values: `dark`, `light`. If not provided, other color parameters will be used. | dark          |
| timefor    | Specifies whether the time is shown for `file` or `workspace`.                                                         | file          |
| bgc        | Sets the background color of the image. Provide a color code.                                                          | black         |
| keyfillc   | Sets the color of the key name in the SVG image. Provide a color code.                                                 | white         |
| valuefillc | Sets the color of the value name in the SVG image. Provide a color code.                                               | gray          |

If you choose the theme parameter, the bgc, keyfillc, and valuefillc parameters will be ignored. However, if you don't specify the theme parameter, you can customize the colors using the bgc, keyfillc, and valuefillc parameters.

Note: You can specify colors using valid color codes, such as #RRGGBB or color names.

Example usage with query parameters:

```
https://<your-server-url>/api/status?theme=dark&timefor=file
```

This will generate an SVG image with a dark theme, showing the time for the file, a black background color, white key name, and green value name.

### Live Examples

| Theme                                                                  | Demo                                                                                                                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dark                                                                   | [![Live feed](https://vstatus.rubenk.com.np/api/status?theme=dark&timefor=file)](https://github.com/slithery0)                                        |
| Light                                                                  | [![Live feed](https://vstatus.rubenk.com.np/api/status?theme=light&timefor=file)](https://github.com/slithery0)                                       |
| bgc `000000`                                                           | [![Live feed](https://vstatus.rubenk.com.np/api/status?bgc=000000&timefor=file)](https://github.com/slithery0)                                        |
| bgc `282828` keyfillc `fbf1c7` valuefillc `d5c4a1` timefor `workspace` | [![Live feed](https://vstatus.rubenk.com.np/api/status?bgc=282828&keyfillc=fbf1c7&valuefillc=d5c4a1&timefor=workspace)](https://github.com/slithery0) |

## License

This project is licensed under the MIT License.
