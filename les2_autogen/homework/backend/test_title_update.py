#!/usr/bin/env python3
"""
测试会话标题自动更新功能
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_title_update():
    """测试标题自动更新功能"""
    print("=" * 60)
    print("测试会话标题自动更新功能")
    print("=" * 60)
    
    # 1. 创建新会话
    print("\n1. 创建新会话...")
    create_response = requests.post(f"{BASE_URL}/sessions", json={
        "title": "新对话"
    })
    
    if create_response.status_code != 200:
        print(f"创建会话失败: {create_response.status_code}")
        print(create_response.text)
        return
    
    session_data = create_response.json()
    session_id = session_data['data']['id']
    print(f"✅ 会话创建成功，ID: {session_id}")
    print(f"   初始标题: {session_data['data']['title']}")
    print(f"   消息数量: {session_data['data']['message_count']}")
    
    # 2. 发送第一条消息
    print(f"\n2. 发送第一条消息...")
    first_message = "你好，这是我的第一个问题，用来测试标题自动更新功能，看看是否会自动使用这个问题作为标题"
    chat_response = requests.post(f"{BASE_URL}/chat", json={
        "message": first_message,
        "session_id": session_id,
        "stream": False
    })
    
    if chat_response.status_code == 200:
        print("✅ 第一条消息发送成功")
        
        # 获取更新后的会话信息
        session_response = requests.get(f"{BASE_URL}/sessions/{session_id}")
        if session_response.status_code == 200:
            updated_session = session_response.json()['data']
            print(f"   更新后的标题: {updated_session['title']}")
            print(f"   消息数量: {updated_session['message_count']}")
            print(f"   第一个问题时间: {updated_session.get('first_question_time', '无')}")
            
            # 验证标题是否正确更新
            expected_title = first_message[:30] + "..." if len(first_message) > 30 else first_message
            if updated_session['title'] == expected_title:
                print("✅ 标题自动更新成功")
            else:
                print(f"❌ 标题更新失败，期望: {expected_title}")
                
            # 验证消息数量
            if updated_session['message_count'] == 1:
                print("✅ 消息数量统计正确")
            else:
                print(f"❌ 消息数量统计错误，期望: 1，实际: {updated_session['message_count']}")
        else:
            print("❌ 获取会话信息失败")
    else:
        print(f"❌ 第一条消息发送失败: {chat_response.status_code}")
        print(chat_response.text)
        return
    
    # 3. 发送第二条消息
    print(f"\n3. 发送第二条消息...")
    second_message = "这是第二个问题"
    chat_response = requests.post(f"{BASE_URL}/chat", json={
        "message": second_message,
        "session_id": session_id,
        "stream": False
    })
    
    if chat_response.status_code == 200:
        print("✅ 第二条消息发送成功")
        
        # 获取更新后的会话信息
        session_response = requests.get(f"{BASE_URL}/sessions/{session_id}")
        if session_response.status_code == 200:
            updated_session = session_response.json()['data']
            print(f"   标题保持不变: {updated_session['title']}")
            print(f"   消息数量: {updated_session['message_count']}")
            
            # 验证消息数量
            if updated_session['message_count'] == 2:
                print("✅ 消息数量统计正确")
            else:
                print(f"❌ 消息数量统计错误，期望: 2，实际: {updated_session['message_count']}")
        else:
            print("❌ 获取会话信息失败")
    else:
        print(f"❌ 第二条消息发送失败: {chat_response.status_code}")
        print(chat_response.text)
    
    # 4. 清理测试会话
    print(f"\n4. 清理测试会话...")
    delete_response = requests.delete(f"{BASE_URL}/sessions/{session_id}")
    if delete_response.status_code == 200:
        print("✅ 测试会话删除成功")
    else:
        print(f"❌ 删除测试会话失败: {delete_response.status_code}")

if __name__ == "__main__":
    # 等待服务器启动
    print("等待服务器启动...")
    time.sleep(2)
    
    try:
        test_title_update()
        print("\n" + "=" * 60)
        print("测试完成！")
        print("=" * 60)
        
    except Exception as e:
        print(f"测试过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
