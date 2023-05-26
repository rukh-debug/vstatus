# vstatus

vstatus is a Visual Studio Code extension that extracts workspace information, such as filename, workspace name, and time elapsed, and sends this data to a server. The server then generates an SVG image based on the received information and serves it on an endpoint. This endpoint can be used to retrieve the updated SVG image containing filename, workspace name, and time lapse. (Intented to be used for github readme)

# Live DEMO

[![Live feed](https://vstatus.rubenk.com.np/api/status?theme=dark&timefor=file)](https://github.com/slithery0)

## Extension's Requirements

- Visual Studio Code version 1.78.0 or higher.


## Installation

To use vstatus, follow these steps:

Deploy the server by clicking on the "Deploy to Vercel" button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fslithery0%2Fvstatus%2Ftree%2Fmain%2Fserver-next&env=UNIQUE_API_KEY&envDescription=API%20key%20that%20you%20will%20require%20while%20sending%20data%20from%20your%20vscode%20extension.%20Generate%20a%20secure%20one%20and%20keep%20it%20safe.&project-name=vstatus&repository-name=vstatus)

You will be asked to add a `UNIQUE_API_KEY`. Remember to generate a secure key and keep it safe, you wll need it later.

Install the vstatus extension in Visual Studio Code.

Open the extension's settings by navigating to **File > Preferences > Settings** or using the keyboard shortcut **Ctrl+Comma (,)**.

Configure the following settings:

- `vstatus.interval`: Specifies the interval (in seconds) at which vstatus extracts workspace information. Default: 10.

- `vstatus.serverurl`: This is the URL of the deployed server. Provide the URL where the server is hosted and accessible.

- `vstatus.apiKey`: This is the API key set during the deployment of the server. The server stores the key in the .env file with the variable name UNIQUE_API_KEY.

Save the settings.

## Usage

To retrieve the SVG image containing the workspace information, use the following URL:

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

License
This project is licensed under the MIT License.
