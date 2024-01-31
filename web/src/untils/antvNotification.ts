import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { notification, type NotificationPlacement } from 'ant-design-vue';

/**
 * 提示框
 * @param placement 位置 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'
 * @param message 标题
 * @param description 内容
 * @param fail 成功/失败
 */
const openNotification = (placement: NotificationPlacement, message: string, description: string = '', fail: boolean = true, isShow: boolean = true) => {
  isShow && notification.open({
    message: `${message}`,
    description:
      description || '',
    placement,
    icon: () => h(fail ? CloseCircleOutlined : CheckCircleOutlined, { style: fail ? 'color: rgb(200, 0, 0)' : 'color: rgb(0, 255, 0)' }),
  });
};

export { openNotification }