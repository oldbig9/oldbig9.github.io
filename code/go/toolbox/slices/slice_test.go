package slices

import (
	"encoding/json"
	"testing"
)

func TestSort(t *testing.T) {
	type args struct {
		s []*Data
	}
	tests := []struct {
		name string
		args args
	}{
		{
			name: "test",
			args: args{
				s: []*Data{
					{
						Name:     "A",
						Priority: 1,
					},
					{
						Name:     "B",
						Priority: 1,
					},
					{
						Name:     "C",
						Priority: 0,
					},
					{
						Name:     "D",
						Priority: 2,
					},
					{
						Name:     "F",
						Priority: 3,
					},
					{
						Name:     "E",
						Priority: 2,
					},
					{
						Name:     "G",
						Priority: 0,
					},
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			Sort(tt.args.s)
			bf, _ := json.MarshalIndent(tt.args.s, "", "    ")
			t.Logf("%s", bf)
		})
	}
}
