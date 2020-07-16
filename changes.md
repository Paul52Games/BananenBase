# V4.0.0
A compleat rewrite!

- The BananenBase uses a module-bases system now!
- Added modules: alias, database, loader, messageflags, security and start!
- Finaly created a documentation!
- Removed webserver functions, they will be added in V4.1

# V3.2.13
## Fixed
- Custom message functions

# V3.2.12
## Fixed
- A database load issue

# V3.2.11
## Fixed
- A database chrash issue

# V3.2.10
## Fixed
- Typedefs are now working when you're using a typescript file
- You can now use a external database

# V3.2.9
## Fixed
- Typedefs for typescript

# V3.2.8
## Added
- Added typedefs for typescript
- Added client events:
  - bb_message: Will be called when the BananenBase functions are set on a message (message.error, message.author.settings, etc).<br>It has one parameter: The message
  - bb_command: Will be called before a command is called.<br>It has to parameters: The message and the command object
- Added a setting for disabling errors for commands, named `commandErrorThrowing` (default: `true`)
- Added a setting for the event emitter to increse the limit of 10 functions per event, called `eventEmitterMaxFuncions`. Default: `10`
- Added a way to view your version: `BananenBase.version`

# V3.2.7 
## Added
- Trigger commands on message updates option (default to false)
- Custom send function for editing messages that are allready sent and needs to be edited
- Better error handling
- Bot owners can allways use commands, even when the bot is restarting.
## Fixed
- A bug with the active channels
- Spelling problem with the "message.error" function
- The BananenBase now supports more command file syntax!

# V3.2.5 / V3.2.6
## Added
- That botowners now can use commands when the channel is active.
## Fixed
- Some spelling mistakes.
- Database error handling (bot will now crash when a keyv database crashes)

# V3.2.4
## Added
- Support for more types of command exports.
## Fixed
- Some syntax things

# V3.2.3
## Fixed
- Some uncertainty with loading commands

# V3.2.2
## Added
- The option keepTrackOfDatabase.
## Fixed
- A couple database issues.

# V3.2.1
## Added
- Default permissions: The bot also checks if he has them.
## Fixed
- Some issues with checking the user and bot permissions.

# V3.2.0
## Added
- The option to use different languages (There is Dutch and English now).
- The option to use a other message file in stead of the default one.
- The client.stop() function.
## Fixed
- The colors for the permission error message embed.
- The bot permissions message.

# V3.1.4
## Added
- The changes log file
## Fixed
- A issue with loading the files on unix-based operating systems.
