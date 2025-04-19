import axios from "../utils/axios";

// 菜单相关API
export const getMenuItems = async () => {
  try {
    console.log("发起请求到 /api/menu-items"); // 确认函数被调用
    const response = await axios.get("/api/menu-items"); // 假设是GET请求
    console.log("Axios 响应:", response); // 打印完整响应
    return response;
  } catch (error) {
    console.error("getMenuItems 内部错误:", error);
    // **重要**: 如果希望外部catch捕获，需要重新抛出错误或返回特定值
    // throw error; // 重新抛出，外部catch会捕获
    return []; // 或者返回空数组/null，表示失败但外部不需要知道具体错误细节
  }
};

// 分类相关API
export const getCategoryByPage = async (page = 0, size = 10) => {
  try {
    const response = await axios.get("/api/categories", {
      params: {
        page,
        size,
      },
    });
    return response;
  } catch (error) {
    console.error("获取分类数据失败:", error);
    throw error;
  }
};

export const getCategorys = async () => {
  try {
    const response = await axios.get(`/api/categories/all`);
    return response;
  } catch (error) {
    console.error("获取分类详情失败:", error);
    throw error;
  }
};

// 创建分类
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post("/api/categories", categoryData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8", // 尝试移除这行
      },
    });
    return response;
  } catch (error) {
    console.error("创建分类失败:", error);
    throw error;
  }
};

// 删除分类
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`/api/categories/${id}`);
    return response;
  } catch (error) {
    console.error("删除分类失败:", error);
    throw error;
  }
};

// 更新分类
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`/api/categories/${id}`, categoryData, {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
    return response;
  } catch (error) {
    console.error("更新分类失败:", error);
    throw error;
  }
};

// 创建菜单项
export const createMenuItem = async (file, menuItem, categoryId) => {
  // 1. 创建 FormData 对象
  const formData = new FormData();

    // 2. 添加文件(如果有新文件)
    if (file) {
      formData.append("file", file);
    }

  // 3. 添加 categoryId
  // 后端需要名为 "categoryId" 的参数，作为表单字段添加
  formData.append("categoryId", categoryId.toString());

  // 4. 添加 menuItem 对象 (作为JSON字符串)
  // !!重要: 由于原始后端签名使用了 @RequestBody，而文件上传需要 multipart/form-data，
  // !!标准的做法是将非文件数据（如menuItem对象）也作为 FormData 的一部分发送。
  // !!这里将其转换为 JSON 字符串。后端需要能接收名为 "menuItem" 的部分，
  // !!并将其从JSON字符串反序列化为MenuItem对象。
  // !!后端的参数注解可能需要从 @RequestBody 改为 @RequestPart("menuItem")。
  formData.append("menuItem", JSON.stringify(menuItem));
  // 如果后端配置为可以自动转换，有时需要指定 Content-Type for this part:
  // formData.append('menuItem', new Blob([JSON.stringify(menuItem)], { type: 'application/json' }), 'menuItem');

  // 5. 配置 Axios 请求头
  const config = {
    headers: {
      // 当 Axios 的 data 是 FormData 对象时，它会自动设置正确的
      // 'Content-Type': 'multipart/form-data; boundary=...'
      // 通常不需要手动设置，否则可能导致边界（boundary）不匹配。
      // 'Content-Type': 'multipart/form-data', // 通常不需要取消注释
    },
  };

  try {
    // 6. 发送 POST 或 PUT 请求
    // 更新操作通常使用 PUT，但 POST 也常用于包含文件上传的复杂操作。
    // 请根据你的后端 API 设计选择 .post 或 .put
    console.log("发送更新请求到:", "/api/menu-items/createMenu");
    console.log("FormData 内容:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // 假设使用 POST
    const response = await axios.post("/api/menu-items/createMenu", formData, config);
    // 或者使用 PUT:
    // const response = await axios.put(url, formData, config);

    console.log("更新成功:", response.data);
    return response.data; // 返回后端返回的数据
  } catch (error) {
    console.error("更新菜单项时出错:");
    if (error.response) {
      // 请求已发出，但服务器响应状态码不在 2xx 范围内
      console.error("错误数据:", error.response.data);
      console.error("错误状态码:", error.response.status);
      console.error("错误请求头:", error.response.headers);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error("未收到响应:", error.request);
    } else {
      // 在设置请求时触发了错误
      console.error("请求设置错误:", error.message);
    }
    console.error("错误配置:", error.config);
    throw error; // 重新抛出错误，以便调用者可以处理
  }
};

// 创建菜单项
export const updataMenuItem = async (file, menuItem, categoryId) => {
    // 1. 创建 FormData 对象
    const formData = new FormData();

    // 2. 添加文件(如果有新文件)
    if (file) {
      formData.append("file", file);
    }
  
    // 3. 添加 categoryId
    // 后端需要名为 "categoryId" 的参数，作为表单字段添加
    formData.append("categoryId", categoryId.toString());
  
    // 4. 添加 menuItem 对象 (作为JSON字符串)
    // !!重要: 由于原始后端签名使用了 @RequestBody，而文件上传需要 multipart/form-data，
    // !!标准的做法是将非文件数据（如menuItem对象）也作为 FormData 的一部分发送。
    // !!这里将其转换为 JSON 字符串。后端需要能接收名为 "menuItem" 的部分，
    // !!并将其从JSON字符串反序列化为MenuItem对象。
    // !!后端的参数注解可能需要从 @RequestBody 改为 @RequestPart("menuItem")。
    formData.append("menuItem", JSON.stringify(menuItem));
    // 如果后端配置为可以自动转换，有时需要指定 Content-Type for this part:
    // formData.append('menuItem', new Blob([JSON.stringify(menuItem)], { type: 'application/json' }), 'menuItem');
  
    // 5. 配置 Axios 请求头
    const config = {
      headers: {
        // 当 Axios 的 data 是 FormData 对象时，它会自动设置正确的
        // 'Content-Type': 'multipart/form-data; boundary=...'
        // 通常不需要手动设置，否则可能导致边界（boundary）不匹配。
        // 'Content-Type': 'multipart/form-data', // 通常不需要取消注释
      },
    };
  
    try {
      // 6. 发送 POST 或 PUT 请求
      // 更新操作通常使用 PUT，但 POST 也常用于包含文件上传的复杂操作。
      // 请根据你的后端 API 设计选择 .post 或 .put
      console.log("发送更新请求到:", "/api/menu-items/updateMenu");
      console.log("FormData 内容:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // 假设使用 POST
      const response = await axios.post("/api/menu-items/updateMenu", formData, config);
      // 或者使用 PUT:
      // const response = await axios.put(url, formData, config);
  
      console.log("更新成功:", response.data);
      return response.data; // 返回后端返回的数据
    } catch (error) {
      console.error("更新菜单项时出错:");
      if (error.response) {
        // 请求已发出，但服务器响应状态码不在 2xx 范围内
        console.error("错误数据:", error.response.data);
        console.error("错误状态码:", error.response.status);
        console.error("错误请求头:", error.response.headers);
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        console.error("未收到响应:", error.request);
      } else {
        // 在设置请求时触发了错误
        console.error("请求设置错误:", error.message);
      }
      console.error("错误配置:", error.config);
      throw error; // 重新抛出错误，以便调用者可以处理
    }
};

// 删除分类
export const deleteMenuItem = async (id) => {
  try {
    const response = await axios.delete(`/api/menu-items/${id}`);
    return response;
  } catch (error) {
    console.error("删除分类失败:", error);
    throw error;
  }
};
