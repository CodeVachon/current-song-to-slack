```
   ____                          _     ____                      _          ____  _            _
  / ___|   _ _ __ _ __ ___ _ __ | |_  / ___|  ___  _ __   __ _  | |_ ___   / ___|| | __ _  ___| | __
 | |  | | | | '__| '__/ _ \ '_ \| __| \___ \ / _ \| '_ \ / _` | | __/ _ \  \___ \| |/ _` |/ __| |/ /
 | |__| |_| | |  | | |  __/ | | | |_   ___) | (_) | | | | (_| | | || (_) |  ___) | | (_| | (__|   <
  \____\__,_|_|  |_|  \___|_| |_|\__| |____/ \___/|_| |_|\__, |  \__\___/  |____/|_|\__,_|\___|_|\_\
                                                         |___/

```

Updates your Slack Status to the Current Song Playing in your Apple Music App or iTunes on Mac

> **NOTE**
> THIS ONLY WORKS ON MAC

## Slack Connection

You must creat a slack app to get an oAuth Token needed for the application to update Slack.

1. create a new app [api.slack.com/apps](https://api.slack.com/apps?new_app=1) providing a name and selecting the desired Slack Workspace that you're going to run feed in.
2. Under `Add features and functionality` select the `Permissions` section.
3. scroll down to `User Token Scopes` and add `users.profile:write`.
4. scoll up to the top of the page and click `Install App to Workspace`.
5. copy the `oAuth Access Token`, The application will ask for it when it starts.

## Run the Application

download this repository, run `yarn install` on the repo directory.

### Dev Mode

You can run the application in dev mode by running `yarn dev`.

### Production Mode

You can run the transpiled code using `yarn start`.

### Compile as Script

Optionally, you build and run a compiled script script using `yarn full`. This will create an executeable at `./pkg/current-song-to-slack`.

## Credits

Loosly based off [Github/sbdchd/apple-music-to-slack](https://github.com/sbdchd/apple-music-to-slack).

Updated to run as Typescript and Compile as a package.
