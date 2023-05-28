# vstatus

vstatus is a Visual Studio Code extension that extracts workspace information, such as filename, workspace name, and time elapsed, and sends this data to a server. The server then generates an SVG image based on the received information and serves it on an endpoint. This endpoint can be used to retrieve the updated SVG image containing filename, workspace name, and time lapse. (Intented to be used for github readme)

# Live DEMO

[![Live feed](https://vstatus.rubenk.com.np/api/status?theme=dark&timefor=file)](https://github.com/slithery0)

## Extension's Requirements

- Visual Studio Code version 1.78.0 or higher.

## Installation

To use vstatus, follow these steps:

1. Deploy the server by clicking on the "Deploy to Vercel" button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fslithery0%2Fvstatus%2Ftree%2Fmain%2Fserver-next&env=VSTATUS_API_KEY&envDescription=API%20key%20that%20you%20will%20require%20while%20sending%20data%20from%20your%20vscode%20extension.%20Generate%20a%20secure%20one%20and%20keep%20it%20safe.&project-name=vstatus&repository-name=vstatus)

2. You will be asked to add a `VSTATUS_API_KEY`. Remember to generate a secure key and keep it safe, you wll need it later.

3. Copy your server url.

4. Once you've deployed your server, you'll need to go back to your **Vercel dashboard** and open the project dashboard you just created. From here, navigate to **Storage > Create New Database > select KV (Durable Redis) >> Continue >>**. After successfully creating the database, There will be a **connect** button, where you can click and connect it to the project you just created. ezpz!!!.

5. Install the vstatus extension in Visual Studio Code.

To install

Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

> ext install rubennnk.vstatus

Or you can do it manually. Search `vstatus` and install.

6. Open the extension's settings by navigating to **File > Preferences > Settings** or using the keyboard shortcut **Ctrl+Comma (,)**.

7. Configure the following settings:

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

### Examples

| Theme                                           | Demo                                                                                                                                          |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Dark                                            | [![Live feed](https://vstatus.rubenk.com.np/api/status?theme=dark&timefor=file)](https://github.com/slithery0)                                |
| Light                                           | [![Live feed](https://vstatus.rubenk.com.np/api/status?theme=light&timefor=file)](https://github.com/slithery0)                               |
| bgc `black`                                     | [![Live feed](https://vstatus.rubenk.com.np/api/status?bgc=black&timefor=file)](https://github.com/slithery0)                                 |
| bgc `purple` keyfillc `white` valuefillc `gray` | [![Live feed](https://vstatus.rubenk.com.np/api/status?bgc=purple&keyfillc=white&valuefillc=gray&timefor=file)](https://github.com/slithery0) |

This will generate an SVG image with a dark theme, showing the time for the file, a black background color, white key name, and green value name.

## License

This project is licensed under the MIT License.
