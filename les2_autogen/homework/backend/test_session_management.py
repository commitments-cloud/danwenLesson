#!/usr/bin/env python3
"""
测试会话管理功能的脚本
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_session_lifecycle():
    """测试会话的完整生命周期"""
    print("=" * 60)
    print("测试会话管理功能")
    print("=" * 60)
    
    # 1. 创建新会话
    print("\n1. 创建新会话...")
    create_response = requests.post(f"{BASE_URL}/sessions", json={
        "title": "测试会话",
        "model_name": "deepseek-chat"
    })
    
    if create_response.status_code != 200:
        print(f"创建会话失败: {create_response.status_code}")
        print(create_response.text)
        return
    
    session_data = create_response.json()
    session_id = session_data['data']['id']
    print(f"✅ 会话创建成功，ID: {session_id}")
    
    # 2. 发送消息
    print(f"\n2. 向会话 {session_id} 发送消息...")
    chat_response = requests.post(f"{BASE_URL}/chat", json={
        "message": "你好，这是一条测试消息",
        "session_id": session_id,
        "stream": False
    })
    
    if chat_response.status_code == 200:
        print("✅ 消息发送成功")
    else:
        print(f"❌ 消息发送失败: {chat_response.status_code}")
        print(chat_response.text)
    
    # 3. 获取会话消息
    print(f"\n3. 获取会话 {session_id} 的消息...")
    messages_response = requests.get(f"{BASE_URL}/sessions/{session_id}/messages")
    
    if messages_response.status_code == 200:
        messages_data = messages_response.json()
        message_count = len(messages_data['data']['items'])
        print(f"✅ 获取消息成功，共 {message_count} 条消息")
    else:
        print(f"❌ 获取消息失败: {messages_response.status_code}")
        print(messages_response.text)
    
    # 4. 清空会话消息
    print(f"\n4. 清空会话 {session_id} 的消息...")
    clear_response = requests.delete(f"{BASE_URL}/sessions/{session_id}/clear")
    
    if clear_response.status_code == 200:
        print("✅ 消息清空成功")
        
        # 验证消息是否真的被清空
        messages_response = requests.get(f"{BASE_URL}/sessions/{session_id}/messages")
        if messages_response.status_code == 200:
            messages_data = messages_response.json()
            message_count = len(messages_data['data']['items'])
            if message_count == 0:
                print("✅ 验证成功：消息已被清空")
            else:
                print(f"❌ 验证失败：仍有 {message_count} 条消息")
    else:
        print(f"❌ 清空消息失败: {clear_response.status_code}")
        print(clear_response.text)
    
    # 5. 再次发送消息
    print(f"\n5. 向清空后的会话 {session_id} 发送新消息...")
    chat_response = requests.post(f"{BASE_URL}/chat", json={
        "message": "这是清空后的新消息",
        "session_id": session_id,
        "stream": False
    })
    
    if chat_response.status_code == 200:
        print("✅ 新消息发送成功")
    else:
        print(f"❌ 新消息发送失败: {chat_response.status_code}")
    
    # 6. 删除会话
    print(f"\n6. 删除会话 {session_id}...")
    delete_response = requests.delete(f"{BASE_URL}/sessions/{session_id}")
    
    if delete_response.status_code == 200:
        print("✅ 会话删除成功")
        
        # 验证会话是否真的被删除
        get_response = requests.get(f"{BASE_URL}/sessions/{session_id}")
        if get_response.status_code == 404:
            print("✅ 验证成功：会话已被删除")
        else:
            print(f"❌ 验证失败：会话仍然存在")
    else:
        print(f"❌ 删除会话失败: {delete_response.status_code}")
        print(delete_response.text)

def test_session_list():
    """测试会话列表功能"""
    print("\n" + "=" * 60)
    print("测试会话列表功能")
    print("=" * 60)
    
    # 创建几个测试会话
    session_ids = []
    for i in range(3):
        response = requests.post(f"{BASE_URL}/sessions", json={
            "title": f"测试会话 {i+1}",
            "model_name": "deepseek-chat"
        })
        if response.status_code == 200:
            session_id = response.json()['data']['id']
            session_ids.append(session_id)
            print(f"✅ 创建会话 {i+1}，ID: {session_id}")
    
    # 获取会话列表
    print(f"\n获取会话列表...")
    list_response = requests.get(f"{BASE_URL}/sessions")
    
    if list_response.status_code == 200:
        sessions_data = list_response.json()
        session_count = len(sessions_data['data']['items'])
        print(f"✅ 获取会话列表成功，共 {session_count} 个会话")
        
        # 显示会话信息
        for session in sessions_data['data']['items']:
            print(f"  - 会话 {session['id']}: {session['title']}")
    else:
        print(f"❌ 获取会话列表失败: {list_response.status_code}")
    
    # 清理测试会话
    print(f"\n清理测试会话...")
    for session_id in session_ids:
        delete_response = requests.delete(f"{BASE_URL}/sessions/{session_id}")
        if delete_response.status_code == 200:
            print(f"✅ 删除会话 {session_id}")
        else:
            print(f"❌ 删除会话 {session_id} 失败")

if __name__ == "__main__":
    # 等待服务器启动
    print("等待服务器启动...")
    time.sleep(2)
    
    try:
        # 测试会话生命周期
        test_session_lifecycle()
        
        # 测试会话列表
        test_session_list()
        
        print("\n" + "=" * 60)
        print("所有测试完成！")
        print("=" * 60)
        
    except Exception as e:
        print(f"测试过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
