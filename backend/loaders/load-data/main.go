package main

import (
  "github.com/lmittmann/tint"
  "github.com/spf13/cobra"
  "log/slog"
  "os"
  "time"

  "load-data/commands"
)

var rootCmd = &cobra.Command{
  Use: "<command> <command-options>",
  Short: "Generate or load different types of data",
}

func init() {
  rootCmd.AddCommand(commands.GenerateSatDetectionsCmd)
  rootCmd.AddCommand(commands.LoadSatDetectionsCmd)
}

func main() {
  // Set up custom structured logging with colorized output
  slog.SetDefault(slog.New(tint.NewHandler(os.Stderr, &tint.Options{
    Level: slog.LevelDebug,
    TimeFormat: time.TimeOnly,
  })))

  rootCmd.Execute()
}
