<h3>Auto Wholesale</h3>
&nbsp;[Official Site][official] | [Support][help] | [Changelog][changelog]
&nbsp;&copy; 2016 [Nora Taiym][norataiym] ([@norataiymUTSA](https://twitter.com/norataiymUTSA))
<br>
Quickly find and manage your vehicle inventory from anywhere.

---

[official]: https://github.com/norataiym/AutoWholesale
[help]: https://github.com/norataiym/AutoWholesale/issues
[changelog]: https://github.com/norataiym/AutoWholesale/releases
[norataiym]: https://twitter.com/norataiymUTSA


===================================

1) Brief
------------------------------------------

The project uses Ionic/AngularJS for templating and HTML5 design. The application is bundled for native deployment using Cordova on the following platforms: iOS, Android, Blackberry and Windows Phone.

2) Folder Structure
------------------------------------------

The root directory contains configuration files for various items such as Git configuration (ignore, attributes, etc), Cordova (config.xml), parser configuration (CSSLint, editor configuration, JSCSRC, JSHint and package.json) and this readme file.

**resources** image assets used for packaged application such as icons and splash screens.

**www** contains the web assets to be used by the webview. This is the bulk of the web application and what is deployed to Azure.

3) Build Instructions
------------------------------------------

Several methods exist to live view the application for development as well as building. The following steps will install the development environment needed to run the application and build for deployment. Please note this depends on both [`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [`node`](https://nodejs.org/en/download/) being installed first.

```
# Clone the repository
git clone https://github.com/norataiym/AutoWholesale

# Change into project directory
cd AutoWholesale

# Install required global modules
npm install -g cordova ionic gulp

# Install required local NPM packages
npm install

# Install required Cordova platforms and plugins
ionic state restore

# Serve a live version of the app in the default browser
ionic serve
```
