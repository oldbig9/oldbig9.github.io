package pic

import "testing"

func TestCompressPic(t *testing.T) {
	type args struct {
		filename string
		des      string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "test",
			args: args{
				filename: "/mnt/c/Users/wwf/Downloads/xiaoai.png",
				des:      "/mnt/c/Users/wwf/Downloads/xiaoai-c.png",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CompressPic(tt.args.filename, tt.args.des); (err != nil) != tt.wantErr {
				t.Errorf("CompressPic() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
