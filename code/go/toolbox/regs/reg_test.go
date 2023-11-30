package regs

import "testing"

func TestMatch(t *testing.T) {
	type args struct {
		s string
		r string
	}
	tests := []struct {
		name        string
		args        args
		wantMatched bool
		wantErr     bool
	}{
		{
			name: "测试",
			args: args{
				s: "xiaoaiicon.1.1.1",
				r: "^xiaoaiicon\\.\\d.\\d\\.1$",
			},
			wantErr:     false,
			wantMatched: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotMatched, err := Match(tt.args.s, tt.args.r)
			if (err != nil) != tt.wantErr {
				t.Errorf("Match() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if gotMatched != tt.wantMatched {
				t.Errorf("Match() = %v, want %v", gotMatched, tt.wantMatched)
			}
		})
	}
}

func BenchmarkMatch(b *testing.B) {
	s := "xiaoaiicon.1.1.1"
	r := `^xiaoaiicon\.\d.\d\.1$`
	for i := 0; i <= b.N; i++ {
		Match(s, r)
	}
}

func BenchmarkStringMatch(b *testing.B) {
	s := "xiaoaiicon.1.1.1"
	r := `xiaoaiicon\.\d.\d\.1`
	for i := 0; i <= b.N; i++ {
		Match(s, r)
	}
}
