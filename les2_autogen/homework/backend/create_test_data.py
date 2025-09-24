#!/usr/bin/env python3
"""
创建测试数据
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def create_test_data():
    """创建测试数据"""
    print("创建测试数据...")
    
    # 创建几个测试会话
    sessions = []
    test_messages = [
        "你好，这是第一个测试会话的问题，用来验证前端显示效果",
        "请帮我写一个Python函数来计算斐波那契数列",
        "如何在React中使用useState钩子？"
    ]
    
    for i, message in enumerate(test_messages):
        # 创建会话
        response = requests.post(f"{BASE_URL}/sessions", json={'title': '新对话'})
        if response.status_code == 200:
            session_id = response.json()['data']['id']
            sessions.append(session_id)
            
            # 发送第一条消息
            requests.post(f"{BASE_URL}/chat", json={
                'message': message,
                'session_id': session_id,
                'stream': False
            })
            
            # 如果是第二个会话，再发送一条消息
            if i == 1:
                requests.post(f"{BASE_URL}/chat", json={
                    'message': '请给出详细的代码示例',
                    'session_id': session_id,
                    'stream': False
                })
            
            print(f'✅ 创建测试会话 {i+1}，ID: {session_id}')
            time.sleep(1)  # 稍微延迟一下，让时间戳不同
    
    print(f"\n✅ 测试数据创建完成！")
    print(f"前端地址: http://localhost:3001")
    print(f"后端地址: http://localhost:8000")
    
    return sessions

if __name__ == "__main__":
    try:
        sessions = create_test_data()
        print(f"\n创建的会话ID: {sessions}")
        
    except Exception as e:
        print(f"创建测试数据时发生错误: {e}")
        import traceback
        traceback.print_exc()
