### redux的应用场景

假设你现在有个列表组件，输入是列表内容，输出是列表视图，但你希望这个列表内容的修改暴露出去，就可以用redux，列表组件本身useSelector这个store，然后负责修改列表组件的组件useDispatch对应的action



