package commands

import (
"log/slog"
"strconv"

"github.com/spf13/cobra"
"github.com/spf13/pflag"
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

func (cmd BaseCommand) IntSliceFlagVal(name string) []int {
  sliceVal, ok := cmd.Flag(name).Value.(pflag.SliceValue)

  if ok {
    vals := sliceVal.GetSlice()
    res := make([]int, len(vals))
    for ix, str := range vals {
      intv, err := strconv.Atoi(str)
      if err != nil {
        slog.Error("Error parsing numeric slice argument data: " + err.Error())
      }

      res[ix] = intv
    }

    return res
  } else {
    return make([]int, 0)
  }
}
