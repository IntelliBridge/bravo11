package commands

import (
"log/slog"
"strconv"

"github.com/spf13/cobra"
)

type BaseCommand struct {
  *cobra.Command
}

func (cmd BaseCommand) StringFlagVal(name string) string {
  return cmd.Flag(name).Value.String()
}

func (cmd BaseCommand) BoolFlagVal(name string) bool {
  return cmd.Flag(name).Value.String() == "true"
}

func (cmd BaseCommand) IntFlagVal(name string) int {
  num, err := strconv.Atoi(cmd.Flag(name).Value.String())
  if err != nil {
    slog.Error("Error parsing numeric argument data: " + err.Error())
  }

  return num
}
