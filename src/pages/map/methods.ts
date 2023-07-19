
const district = (AMap: any, map: any) => {
    const district = new AMap.DistrictSearch({
        subdistrict: 0,   //获取边界不需要返回下级行政区
        extensions: 'all',  //返回行政区边界坐标组等具体信息
        level: 'district'  //查询行政级别为 市
    });
    district.search('东方市', function (status: string, result: any) {
        if (status === 'complete') {
            const data = result.districtList[0].boundaries;
            for (let i = 0; i < data.length; i += 1) {//构造MultiPolygon的path
                data[i] = [data[i]]
            }
            const polygon = new AMap.Polygon({
                strokeWeight: 1,
                path: data,
                fillOpacity: 0.2,
                fillColor: '#80d8ff',
                strokeColor: '#0091ea'
            });
            map.add(polygon)
            map.setFitView(polygon);//视口自适应
        }
    });
}


