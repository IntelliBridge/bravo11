package main

import (
  "log/slog"
  "os"
  "time"

  "github.com/lmittmann/tint"
  "github.com/spf13/cobra"

  "signalsight-elt/commands"
  "signalsight-elt/util"
)

var rootCmd = &cobra.Command{
  Use: "<command> <command-options>",
  Short: "Generate or load different types of data",
}

func init() {
  rootCmd.AddCommand(commands.GenerateSatDetectionsCmd)
  rootCmd.AddCommand(commands.LoadSatDetectionsCmd)
  rootCmd.AddCommand(commands.PredictLocationsCmd)
}

func main() {
  // Set up custom structured logging with colorized output
  level := slog.LevelInfo
  if util.GetEnv("DEBUG", "false") == "true" {
    level = slog.LevelDebug
  }
  slog.SetDefault(slog.New(tint.NewHandler(os.Stderr, &tint.Options{
    Level: level,
    TimeFormat: time.TimeOnly,
  })))

  rootCmd.Execute()
}
