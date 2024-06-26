completion() {
  # List of actions
  local actions="
        up
        down
        getCurrentScale
        scale
        ps
        echoInstanceFor
        echoInstance
        clean
        create_owner
        import_wf
        wait_n8n
        deploy
        redeploy
        rs
        "

  COMPREPLY=($(compgen -W "$actions" "${COMP_WORDS[1]}"))
}

complete -F completion ./manage.sh
