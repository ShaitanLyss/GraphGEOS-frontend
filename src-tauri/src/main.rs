// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// #[macro_use]
// extern crate dotenv_codegen;
// extern crate dotenv;

use tauri::Manager;

use dotenv::dotenv;
// use std::{env, sync::Arc};

use tauri::{Position, Window, WindowBuilder};

fn move_window_to_other_monitor(window: &Window, i: usize) -> tauri::Result<()> {
    let monitors = window.available_monitors()?;
    let monitor = monitors.get(i).ok_or(tauri::Error::CreateWindow)?;

    let pos = monitor.position();

    window.set_position(Position::Physical(
        tauri::PhysicalPosition{
            x: pos.x,
            y: 0
        })
    )?;

    window.center()?;
    Ok(())
}





fn main() {
    dotenv().ok();
    // for (key, value) in env::vars() {
    //     eprintln!("{}: {}", key, value);
    // }
      // prepare() checks if it's a single instance and tries to send the args otherwise.
          // It should always be the first line in your main function (with the exception of loggers or similar)
      // It's expected to use the identifier from tauri.conf.json
          // Unfortuenetly getting it is pretty ugly without access to sth that implements `Manager`.
      tauri_plugin_deep_link::prepare("eu.lyssandre.geos-gui");
      tauri::Builder::default()
   .setup(|app| {
      // If you need macOS support this must be called in .setup() !
      // Otherwise this could be called right after prepare() but then you don't have access to tauri APIs
      
      let handle = app.handle();
      tauri_plugin_deep_link::register(
        "geos-gui",
        move |request| {
          dbg!(&request);
          handle.emit_all("scheme-request-received", request).unwrap();
        },
      )
      .unwrap(/* If listening to the scheme is optional for your app, you don't want to unwrap here. */);
        
      // If you also need the url when the primary instance was started by the custom scheme, you currently have to read it yourself
      /*
      #[cfg(not(target_os = "macos"))] // on macos the plugin handles this (macos doesn't use cli args for the url)
      if let Some(url) = std::env::args().nth(1) {
        app.emit_all("scheme-request-received", url).unwrap();
      }
      */

      Ok(())
    })
    // .plugin(tauri_plugin_deep_link::init()) // consider adding a js api later
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
