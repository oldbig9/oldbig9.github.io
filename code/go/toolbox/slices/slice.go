package slices

import "sort"

type Data struct {
	Name     string `json:"name"`
	Priority int    `json:"priority"`
}

func Sort(s []*Data) {
	sort.SliceStable(s, func(i, j int) bool {
		return s[i].Priority > s[j].Priority
	})
}
