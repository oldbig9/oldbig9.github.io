package regs

import (
	"regexp"
	"strings"
)

func Match(s string, r string) (matched bool, err error) {
	re, err := regexp.Compile(r)
	if err != nil {
		return
	}

	matched = re.MatchString(s)

	return
}

func StringMatch(s string) bool {
	return strings.HasPrefix(s, "xiaoaiicon") && strings.HasSuffix(s, ".1")
}
