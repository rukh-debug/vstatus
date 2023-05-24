# vstatus (VS Code Status)

[![Almost live DEMO](https://vstatus.rubenk.com.np/)](https://vstatus.rubenk.com.np/) 

<!-- [![Version](https://vsmarketplacebadge.apphb.com/version/your-extension-name.your-extension-id.svg)](https://marketplace.visualstudio.com/items?itemName=your-extension-name.your-extension-id)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads/your-extension-name.your-extension-id.svg)](https://marketplace.visualstudio.com/items?itemName=your-extension-name.your-extension-id)
[![Rating](https://vsmarketplacebadge.apphb.com/rating/your-extension-name.your-extension-id.svg)](https://marketplace.visualstudio.com/items?itemName=your-extension-name.your-extension-id) -->

> vstatus is a Visual Studio Code extension that tracks your workspace and file durations, generates insightful activity visualizations, and provides a live status image via an HTTP server.
(Initially Intented to be used for github readme page)

Stay productive and share your coding progress with vstatus! 

## Features (Incomplete, Need lot of works.)

- **Workspace and File Duration Tracking:** vstatus tracks the durations of your activity within Visual Studio Code, capturing the time spent on workspaces and individual files.

- **Activity Visualization:** Using the collected information, vstatus generates visually appealing and insightful activity visualizations. These visualizations provide a graphical representation of your coding patterns and productivity.

- **Live Status Image:** vstatus creates an HTTP server to serve the generated activity visualization as a live status image. You can access this image via a specific URL, allowing you to share and monitor your coding progress with others.

## Requirements

- Visual Studio Code version 1.78.0 or higher.

## Installation

1. Launch Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the left sidebar or pressing `Ctrl+Shift+X`.
3. Search for `vstatus` in the Extensions Marketplace.
4. Click on the "Install" button for the "vstatus" extension.
5. Once installed, the extension will be active and ready to use.

## Usage

1. Open Visual Studio Code.
2. Customize the extension's settings, such as the tracking interval and visualization options, through the extension's settings panel.
3. As you work in Visual Studio Code, vstatus will automatically track your workspace and file durations.
4. Access the live status image by opening the provided URL in a web browser. Share this URL with others to showcase your coding activity.
5. Enjoy visualizing and sharing your coding progress with vstatus!

## Configuration

vstatus provides the following configuration options:

- `vstatus.interval`: Specifies the interval (in seconds) at which vstatus extracts workspace information. Default: `10`.

- `vstatus.visualizationTheme`: Defines the theme for the activity visualization. Choose from available options: `light`, `dark`. Default: `light`.

- `vstatus.serverPort`: Specifies the port number on which the HTTP server for vstatus will listen. Default: `45903`.

## Contributing

Contributions are welcome! If you encounter any issues, have suggestions, or want to contribute to the project, please feel free to open a new issue or submit a pull request. For more information, refer to the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).


## Todo

[] Theme (Dark/Light)
[] Other form of stats
[] Different types of images
