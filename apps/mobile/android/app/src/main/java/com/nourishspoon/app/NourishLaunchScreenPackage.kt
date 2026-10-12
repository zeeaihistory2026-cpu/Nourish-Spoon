package com.nourishspoon.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager

class NourishLaunchScreenModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "NourishLaunchScreen"
  @ReactMethod fun hide() {
    reactApplicationContext.currentActivity?.let { activity ->
      activity.runOnUiThread { NourishLaunchScreen.hide(activity) }
    }
  }
}

class NourishLaunchScreenPackage : ReactPackage {
  override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> = listOf(NourishLaunchScreenModule(context))
  override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
