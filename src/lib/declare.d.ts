

// three-path.d.ts
declare module 'three.path' {
    import { BufferGeometry ,Vector3} from "three";
    // 声明 PathPointList 类
    class PathPointList {
        points: Array<[number, number]>; // 假设使用数组存储 2D 坐标点

        constructor(){
            return BufferGeometry
        };

        // 添加点
        addPoint(point: [number, number]): void;
        // 获取所有点
        getPoints(): Array<[number, number]>;

        // 清空点
        clear(): void;

        // 获取点的数量
        getCount(): number;

        //设置
        set(points:Vector3[],a:number,b:number,direction:Vector3,bool:boolean):this
    }

    // 声明 PathGeometry 类
    class PathGeometry {
        // path: Path;

        // constructor(path: Path);

        // 根据 Path 对象生成几何体
        generateGeometry(): void;

        // 更新几何体
        update(PathPointList,params:{
            width: number,
            arrow: boolean,
        }): BufferGeometry;
    }

    // 声明 Path 类
    class Path {
        pointsList: PathPointList; // 包含 PathPointList 的属性

        // 生成 Path 对应的几何体
        toPathGeometry(): PathGeometry;
    }
}
