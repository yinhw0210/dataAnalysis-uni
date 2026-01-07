# 豆包去水印 API 文档

## 基础信息

- **生产环境 API 地址**: `https://14.103.153.217/api`
- **开发环境 API 地址**: `http://127.0.0.1:8000`
- **接口前缀**: `/doubao`
- **完整接口地址示例**: 
  - 生产环境: `https://14.103.153.217/api/doubao/extract`
  - 开发环境: `http://127.0.0.1:8000/doubao/extract`
- **请求格式**: JSON
- **响应格式**: JSON

---

## 接口列表

### 1. 提取无水印原图

**接口地址**: `POST /doubao/extract`

**功能**: 从豆包分享链接中提取 AI 生成图片的无水印原图

**请求参数**:
```json
{
  "url": "https://www.doubao.com/thread/xxx"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | string | 是 | 豆包分享链接 |

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "url": "https://www.doubao.com/thread/xxx",
    "image_count": 4,
    "images": [
      {
        "id": "a1b2c3d4e5f6...",
        "original_url": "https://xxx.bytetos.com/rc_gen_image/xxx",
        "width": 2048,
        "height": 2048,
        "prompt": "生成该图片的提示词"
      }
    ]
  },
  "message": "提取成功"
}
```

**错误响应**:
```json
{
  "code": 500,
  "data": null,
  "message": "请提供有效的豆包分享链接"
}
```

---

### 2. 下载图片 (Base64)

**接口地址**: `POST /doubao/download`

**功能**: 下载豆包图片，返回 base64 编码

**请求参数**:
```json
{
  "url": "https://xxx.bytetos.com/rc_gen_image/xxx",
  "filename": "my_image.png"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | string | 是 | 图片 URL (从 extract 接口获取) |
| filename | string | 否 | 自定义文件名 |

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "size": 1234567,
    "filename": "my_image.png"
  },
  "message": "下载成功"
}
```

---

### 3. 下载图片 (文件流)

**接口地址**: `POST /doubao/download_stream`

**功能**: 下载豆包图片，直接返回图片文件流

**请求参数**:
```json
{
  "url": "https://xxx.bytetos.com/rc_gen_image/xxx",
  "filename": "my_image.png"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | string | 是 | 图片 URL |
| filename | string | 否 | 下载时的文件名 |

**响应**: 直接返回图片二进制流，Content-Type 为 `image/png`

---

## 调用示例

### JavaScript/TypeScript

```javascript
// API 基础地址
const API_BASE_URL = 'https://14.103.153.217/api'; // 生产环境
// const API_BASE_URL = 'http://127.0.0.1:8000'; // 开发环境

// 1. 提取无水印原图
const extractImages = async (shareUrl) => {
  const response = await fetch(`${API_BASE_URL}/doubao/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: shareUrl })
  });
  return response.json();
};

// 2. 下载图片 (Base64)
const downloadImage = async (imageUrl) => {
  const response = await fetch(`${API_BASE_URL}/doubao/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: imageUrl })
  });
  return response.json();
};

// 使用示例
const result = await extractImages('https://www.doubao.com/thread/xxx');
if (result.code === 200) {
  for (const img of result.data.images) {
    console.log('原图URL:', img.original_url);
    console.log('提示词:', img.prompt);
  }
}
```

### Python

```python
import requests

# API 基础地址
API_BASE_URL = 'https://14.103.153.217/api'  # 生产环境
# API_BASE_URL = 'http://127.0.0.1:8000'  # 开发环境

# 1. 提取无水印原图
def extract_images(share_url):
    response = requests.post(
        f'{API_BASE_URL}/doubao/extract',
        json={'url': share_url}
    )
    return response.json()

# 2. 下载图片
def download_image(image_url, filename='image.png'):
    response = requests.post(
        f'{API_BASE_URL}/doubao/download_stream',
        json={'url': image_url, 'filename': filename}
    )
    with open(filename, 'wb') as f:
        f.write(response.content)

# 使用示例
result = extract_images('https://www.doubao.com/thread/xxx')
if result['code'] == 200:
    for img in result['data']['images']:
        print(f"原图URL: {img['original_url']}")
        download_image(img['original_url'], f"doubao_{img['id']}.png")
```

### cURL

```bash
# 提取无水印原图 (生产环境)
curl -X POST https://14.103.153.217/api/doubao/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.doubao.com/thread/xxx"}'

# 提取无水印原图 (开发环境)
curl -X POST http://127.0.0.1:8000/doubao/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.doubao.com/thread/xxx"}'

# 下载图片
curl -X POST https://14.103.153.217/api/doubao/download_stream \
  -H "Content-Type: application/json" \
  -d '{"url": "图片URL"}' \
  --output image.png
```

---

## 响应状态码

| code | 说明 |
|------|------|
| 200 | 成功 |
| 500 | 服务器错误 |

---

## 注意事项

1. 豆包分享链接格式: `https://www.doubao.com/thread/xxx`
2. 提取的原图分辨率通常为 2048x2048
3. 首次调用可能需要几秒钟加载浏览器环境
4. 图片 URL 有时效性，建议提取后尽快下载
