package pic

import (
	"fmt"
	"image"
	"os"
)

// 压缩图片
func CompressPic(filename, des string) error {
	fp, err := os.OpenFile(filename, os.O_RDONLY, 0666)
	if err != nil {
		return err
	}
	defer fp.Close()

	_, imageMime, err := image.Decode(fp)
	if err != nil {
		return err
	}

	fmt.Printf("imageMime: %s\n", imageMime)
	return nil
}
