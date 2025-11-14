import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentView, setCurrentView] = useState('start'); // 'start', 'test', 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(90).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SCL-90 题目列表
  const questions = [
    "头痛",
    "神经过敏，心中不踏实",
    "头脑中有不必要的想法或字句盘旋",
    "头晕或晕倒",
    "对异性的兴趣减退",
    "对旁人责备求全",
    "感到别人能控制您的思想",
    "责怪别人制造麻烦",
    "忘性大",
    "担心自己的衣饰整齐及仪态的端正",
    "容易烦恼和激动",
    "胸痛",
    "害怕空旷的场所或街道",
    "感到自己的精力下降，活动减慢",
    "想结束自己的生命",
    "听到旁人听不到的声音",
    "发抖",
    "感到大多数人都不可信任",
    "胃口不好",
    "容易哭泣",
    "同异性相处时感到害羞不自在",
    "感到受骗，中了圈套或有人想抓住您",
    "无缘无故地突然感到害怕",
    "自己不能控制地大发脾气",
    "怕单独出门",
    "经常责怪自己",
    "腰痛",
    "感到难以完成任务",
    "感到孤独",
    "感到苦闷",
    "过分担忧",
    "对事物不感兴趣",
    "感到害怕",
    "您的感情容易受到伤害",
    "旁人能知道您的私下想法",
    "感到别人不理解您、不同情您",
    "感到人们对您不友好，不喜欢您",
    "做事必须做得很慢以保证做得正确",
    "心跳得很厉害",
    "恶心或胃部不舒服",
    "感到比不上他人",
    "肌肉酸痛",
    "感到有人在监视您、谈论您",
    "难以入睡",
    "做事必须反复检查",
    "难以做出决定",
    "怕乘电车、公共汽车、地铁或火车",
    "呼吸有困难",
    "一阵阵发冷或发热",
    "因为感到害怕而避开某些东西、场合或活动",
    "脑子变空了",
    "身体发麻或刺痛",
    "喉咙有梗塞感",
    "感到前途没有希望",
    "不能集中注意力",
    "感到身体的某一部分软弱无力",
    "感到紧张或容易紧张",
    "感到手或脚发重",
    "想到死亡的事",
    "吃得太多",
    "当别人看着您或谈论您时感到不自在",
    "有一些不属于您自己的想法",
    "有想打人或伤害他人的冲动",
    "醒得太早",
    "必须反复洗手、点数或触摸某些东西",
    "睡得不稳不深",
    "有想摔坏或破坏东西的想法",
    "有一些别人没有的想法",
    "感到对别人神经过敏",
    "在商店或电影院等人多的地方感到不自在",
    "感到任何事情都很困难",
    "一阵阵恐惧或惊恐",
    "感到公共场合吃东西很不舒服",
    "经常与人争论",
    "单独一人时神经很紧张",
    "别人对您的成绩没有做出恰当的评价",
    "即使和别人在一起也感到孤单",
    "感到坐立不安，心神不定",
    "感到自己没有什么价值",
    "感到熟悉的东西变成陌生或不像是真的",
    "大叫或摔东西",
    "害怕会在公共场合晕倒",
    "感到别人想占您的便宜",
    "为一些有关“性”的想法而很苦恼",
    "您认为应该因为自己的过错而受到惩罚",
    "感到要很快把事情做完",
    "感到自己的身体有严重问题",
    "从未感到和其他人很亲近",
    "感到自己有罪",
    "感到自己的脑子有毛病"
  ];

  // 因子定义 (根据PDF文档)
  const factors = {
    躯体化: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
    强迫症状: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
    人际关系敏感: [6, 21, 34, 36, 37, 41, 61, 69, 73],
    抑郁: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79],
    焦虑: [2, 17, 23, 33, 39, 57, 72, 78, 80, 86],
    敌对: [11, 24, 63, 67, 74, 81],
    恐怖: [13, 25, 47, 50, 70, 75, 82],
    偏执: [8, 18, 43, 68, 76, 83],
    精神病性: [7, 16, 35, 62, 77, 84, 85, 87, 88, 90],
    睡眠饮食: [19, 44, 59, 60, 64, 66, 89]
  };

  // 计算结果
  const calculateResults = () => {
    if (answers.some(answer => answer === null)) return null;

    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / 90;
    const positiveItems = answers.filter(score => score > 0).length;

    const factorScores = {};
    for (const [factorName, itemIndices] of Object.entries(factors)) {
      const factorTotal = itemIndices.reduce((sum, index) => {
        return sum + answers[index - 1]; // 转换为0-based索引
      }, 0);
      const factorAverage = factorTotal / itemIndices.length;
      factorScores[factorName] = {
        total: factorTotal,
        average: parseFloat(factorAverage.toFixed(2)),
        status: getFactorStatus(factorAverage)
      };
    }

    return {
      totalScore,
      averageScore: parseFloat(averageScore.toFixed(2)),
      positiveItems,
      factorScores
    };
  };

  // 根据平均分获取状态标签
  const getFactorStatus = (average) => {
    if (average >= 4.0) return { label: "重度", color: "bg-red-500" };
    if (average >= 3.0) return { label: "中度", color: "bg-orange-500" };
    if (average >= 2.0) return { label: "轻微", color: "bg-green-500" };
    return { label: "有点", color: "bg-emerald-500" };
  };

  // 处理答案选择
  const handleAnswerSelect = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = score;
    setAnswers(newAnswers);

    // 自动跳转到下一题（最后一题除外）
    if (currentQuestionIndex < 89) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    }
  };

  // 提交测试
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setCurrentView('result');
      setIsSubmitting(false);
    }, 500);
  };

  // 重新开始测试
  const handleRestart = () => {
    setCurrentView('start');
    setCurrentQuestionIndex(0);
    setAnswers(Array(90).fill(null));
  };

  // 渲染启动页
  const renderStartPage = () => (
    <div className="min-h-screen bg-sky-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">SCL-90症状自评量表</h1>
          <p className="text-sm text-gray-600 mb-4">国际通用心理健康筛查工具</p>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <p>通过90道题目评估您近期的心理状态和情绪倾向，涵盖9个重要维度。</p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">评分标准</h3>
            <div className="flex justify-between text-xs">
              <span className="bg-green-100 px-2 py-1 rounded">1 = 完全没有</span>
              <span className="bg-yellow-100 px-2 py-1 rounded">2 = 轻度</span>
              <span className="bg-orange-100 px-2 py-1 rounded">3 = 中度</span>
              <span className="bg-red-100 px-2 py-1 rounded">4 = 偏重</span>
              <span className="bg-purple-100 px-2 py-1 rounded">5 = 严重</span>
            </div>
            <p className="mt-2 text-xs">根据最近1周内的实际感受选择，无需过度思考</p>
          </div>

          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-xs"><strong>重要提示：</strong>本测试仅作为参考工具，不能替代专业诊断。</p>
          </div>

          <div className="flex items-center text-xs">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <span>预计耗时：15-20分钟（请确保环境安静）</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('test')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          开始测试
        </button>
      </div>
    </div>
  );

  // 渲染测试页
  const renderTestPage = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = answers.filter(score => score !== null).length;
    const unansweredCount = 90 - answeredCount;

    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          {/* 进度条 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>问题{currentQuestionIndex + 1}/90</span>
              <span className="text-green-600">已答题:{answeredCount}</span>
              <span className="text-yellow-600">未答题:{unansweredCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex + 1) / 90) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 题目 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">{currentQuestion}</h2>
            
            {/* 选项 */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((score) => (
                <div 
                  key={score}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    answers[currentQuestionIndex] === score 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleAnswerSelect(score)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={score}
                      checked={answers[currentQuestionIndex] === score}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center">
                      {answers[currentQuestionIndex] === score && (
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                    <span>{score}分 - {score === 1 ? '完全没有' : score === 2 ? '轻度' : score === 3 ? '中度' : score === 4 ? '偏重' : '严重'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              上一题
            </button>

            {currentQuestionIndex === 89 ? (
              <button
                onClick={handleSubmit}
                disabled={answers[89] === null || isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  answers[89] === null || isSubmitting
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? '提交中...' : '提交'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={answers[currentQuestionIndex] === null}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  answers[currentQuestionIndex] === null
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                下一题
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染结果页
  const renderResultPage = () => {
    const results = calculateResults();
    if (!results) return <div>正在计算结果...</div>;

    return (
      <div className="min-h-screen bg-sky-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">SCL-90症状自评量表</h1>
              <p className="text-sm text-gray-600">测试结果仅供参考，不作诊断使用</p>
            </div>

            {/* 总分概览 */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">您的SCL-90总分</p>
                <p className="text-3xl font-bold text-blue-600">{results.totalScore}</p>
                <p className="text-gray-600 mt-2">单项平均分: {results.averageScore}</p>
              </div>
            </div>

            {/* 各因子得分表 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">各因子得分及测试情况</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">因子名称</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">总分</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">平均分</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">测试情况</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(results.factorScores).map(([factorName, factorData]) => (
                      <tr key={factorName}>
                        <td className="py-3 px-4 text-sm text-gray-800">{factorName}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{factorData.total}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">{factorData.average}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${factorData.status.color}`}>
                            {factorData.status.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 因子解释说明 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">因子解释说明</h2>
              <div className="space-y-4">
                {Object.entries(results.factorScores).map(([factorName, factorData]) => (
                  <div key={factorName} className="border-l-4 border-blue-500 pl-4 py-3">
                    <div className="flex items-center mb-2">
                      <h3 className="text-md font-semibold text-gray-800 mr-2">{factorName}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${factorData.status.color}`}>
                        {factorData.status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {getFactorExplanation(factorName)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 结果解释 */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">结果解释</h2>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>请用从容的心态来看待本次测试。无论分数如何，请一定记得，我们始终都在你身边。</p>
                <p>SCL-90心理健康自评量表涵盖了情绪状态、思维模式、人际关系、生活习惯等多个维度，它就像一面温柔的镜子，能帮你更清晰地看见自己当下的心理状态。需要知道的是，量表得分仅仅是近期心理感受的投射。</p>
                <p>若某些因子得分较高，或许只是说明你最近在这些方面暂时感受到了压力或困扰，但这绝不等于你存在严重的问题。很多时候，短期的心理波动本就是生活的常态——可能是学习的节奏、工作的挑战，或是人际交往中的小插曲带来的暂时影响。</p>
                <p>如果你发现自己在多个维度上长期感到不适，不妨多给自己一些关注：试着调整自己的作息规律，找到适合自己的放松方式，或是和信任的人好好倾诉聊聊。倘若情绪已经悄悄影响到了日常生活，且靠自己难以调节，也请不要犹豫，及时寻求专业的心理咨询或帮助，这并不是软弱，而是对自己的负责。</p>
                <p>要知道，心理健康和身体健康同样重要，而你，本就值得被好好关心与坚定支持。</p>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h3 className="font-semibold mb-2">测试情况分级标准：</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></span>
                      <span><strong>有点：</strong>平均分1.0-2.0分，症状轻微或偶尔出现</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                      <span><strong>轻微：</strong>平均分2.0-3.0分，症状明显但不影响日常生活</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
                      <span><strong>中度：</strong>平均分3.0-4.0分，症状明显且对日常生活有一定影响</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                      <span><strong>重度：</strong>平均分4.0-5.0分，症状严重且明显影响日常生活</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p><strong>按中国常模结果：</strong>如果您的SCL90总分超过160分，单项均分超过2分就应作进一步检查。标准分为大于200分说明你有很明显的心理问题，可求助于心理咨询；大于250分则比较严重，需要作医学上的详细检查，很可能要做针对性的心理治疗或在医生的指导下服药。</p>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                重新测试
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 获取因子解释文本
  const getFactorExplanation = (factorName) => {
    const explanations = {
      "躯体化": "主要反映身体上的不适症状，如头痛、胸痛、肌肉酸痛等身体表现。高分可能表明存在明显的身体不适或躯体化症状，即心理压力转化为身体症状表现出来。",
      "强迫症状": "主要指那些明知没有必要，但又无法摆脱的无意义的思想、冲动和行为。高分可能表明有明显的强迫观念或行为，如反复思考、反复检查等。",
      "人际关系敏感": "主要指某些个人不自在与自卑感，特别是与其他人相比较时更加突出。高分可能表明在人际交往中存在明显的不适应感、自卑感或对他人评价过度敏感。",
      "抑郁": "主要反映抑郁情绪，包括对生活的兴趣减退、缺乏动力、感到孤独、苦闷，甚至有自杀念头等。高分可能表明存在明显的抑郁倾向或抑郁状态。",
      "焦虑": "主要反映焦虑情绪，包括神经过敏、紧张、害怕、发抖等。高分可能表明存在明显的焦虑情绪或焦虑状态，表现为过度担忧和紧张不安。",
      "敌对": "主要从思维、情感及行为三方面来反映敌对表现，包括容易烦恼和激动、有想打人或伤害他人的冲动等。高分可能表明存在明显的敌对情绪或攻击性行为倾向。",
      "恐怖": "主要反映对某些特定环境或事物的恐惧，如害怕空旷的场所、怕乘公共交通工具等。高分可能表明存在明显的恐惧症状或特定恐惧症。",
      "偏执": "主要指猜疑和关系妄想等。包括感到大多数人都不可信任、感到有人在监视您、谈论您等。高分可能表明存在明显的偏执观念，对他人持怀疑态度。",
      "精神病性": "主要反映一些精神病性症状，如听到旁人听不到的声音、感到别人能控制您的思想、有一些别人没有的想法等。高分可能表明存在某些精神病性症状，需要专业评估。",
      "睡眠饮食": "主要反映睡眠和饮食方面的问题，如胃口不好、难以入睡、睡得不稳不深、吃得太多等。高分可能表明存在明显的睡眠或饮食障碍，这往往是心理压力的重要表现。"
    };
    return explanations[factorName] || "暂无解释";
  };

  // 根据当前视图渲染对应页面
  switch (currentView) {
    case 'start':
      return renderStartPage();
    case 'test':
      return renderTestPage();
    case 'result':
      return renderResultPage();
    default:
      return renderStartPage();
  }
};

export default App;
