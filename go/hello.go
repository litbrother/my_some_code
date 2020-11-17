package main
import (
"fmt"
"unsafe"
)
func main()  {
	var b int = 12
	fmt.Println("length of b(int):",unsafe.Sizeof(b))
	fmt.Println("hello world")

}
