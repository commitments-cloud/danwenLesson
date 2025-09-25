# 封装日志模块
# 控制台处理器、文件处理器
import logging
import os
from pathlib import Path
import time


class DycLogger:
    def __init__(self, name="流星雨", logger_level="INFO", sh_level="INFO", fh_level="INFO"):
        """

        :param name:            日志记录器的名称
        :param logger_level:    日志记录器的等级
        :param sh_level:        控制台处理器的等级
        :param fh_level:        文件台处理器的等级
        """
        self.__logger = logging.getLogger(name)  # 日志记录器
        self.__logger.setLevel(logger_level)

        # 日志处理器
        # 处理器的数据展示的格式
        fmt = logging.Formatter('%(asctime)s - %(filename)s:[%(lineno)s] - [%(levelname)s] - %(message)s')

        # 控制台处理器
        sh = logging.StreamHandler()
        sh.setLevel(sh_level)
        sh.setFormatter(fmt)
        # 文件处理器
        t = time.strftime("%Y-%m-%d") + ".log"
        fp = Path(__file__).parent.joinpath("logs")  # 日志文件夹
        if not fp.exists():  # 当文件夹不存在的时候
            os.mkdir(fp)  # 创建文件夹
        fp = fp.joinpath(t)
        fh = logging.FileHandler(fp, encoding="utf-8")
        fh.setLevel(fh_level)
        fh.setFormatter(fmt)

        if len(self.__logger.handlers) == 0:  # 避免日志重复记录
            # 把日志记录器记录的信息交给 控制处理器sh进行处理
            # if not self.logger.handlers:
            self.__logger.addHandler(sh)  # 班主任1    班主任2
            self.__logger.addHandler(fh)  # 文件1     文件2

    def get_logger(self):
        return self.__logger


if __name__ == '__main__':
    # # 获取年月日
    # t = time.strftime("%Y-%m-%d") + ".log"
    #
    # fp = Path(__file__).parent.parent.joinpath("logs", t)
    # # Path(__file__).parent.parent 项目路径
    # # joinpath 拼接 项目路径\logs\2024-06-23.log
    # print(fp)

    # log = DycLogger().logger
    # log.info("记录正常的操作信息")
    # log.info("记录正常的操作信息")

    log = DycLogger().get_logger()

    log.info("123456")

    log = DycLogger().get_logger()
    log.info("123456")

    logger = DycLogger().get_logger()
    logger.log("AutoGen服务模块启动...")
